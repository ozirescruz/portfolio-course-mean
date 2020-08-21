import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { Post } from "./post.model";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: string, currentPage: string) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: Post[]; maxPosts: number }>(
        "/api/posts" + queryParams
      )
      .pipe(
        map((data) => {
          return {
            posts: data.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post["_id"],
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: data.maxPosts,
          };
        })
      )
      .subscribe((postData) => {
        this.posts = postData.posts;

        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: postData.maxPosts,
        });
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
          creator: null,
        };

        this.posts.push(post);
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: this.posts.length,
        });

        this.router.navigate([""]);
      });
  }

  deletePost(id: string) {
    return this.http.delete(`/api/posts/${id}`);
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
        creator: null,
      };
    }
    this.http
      .put<{ message: string }>(`/api/posts/${id}`, postData)
      .subscribe((response) => {
        this.router.navigate(["/"]);
      });
  }
}
