import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { Post } from "./post.model";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { runInThisContext } from "vm";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: Post[] }>("/api/posts")
      .pipe(
        map((data) => {
          return data.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post["_id"],
              imagePath: post.imagePath,
            };
          });
        })
      )
      .subscribe((postData) => {
        this.posts = postData;

        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", title);
    postData.append("image", image, title);

    this.http
      .post<{ message: string; post: Post }>("/api/posts", postData)
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: "",
        };

        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);

        this.router.navigate([""]);
      });
  }

  deletePost(id: string) {
    this.http.delete(`/api/posts/${id}`).subscribe((response) => {
      console.log(response);
      const updatedPosts = this.posts.filter((post) => post.id != id);
      this.posts = [...updatedPosts];
      this.postsUpdated.next([...this.posts]);
      this.router.navigate([""]);
    });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>(`/api/posts/${id}`);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;

    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", title);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
      };
    }
    this.http
      .put<{ message: string }>(`/api/posts/${id}`, postData)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === id);

        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: "",
        };

        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;

        this.postsUpdated.next([...this.posts]);
      });
  }
}
