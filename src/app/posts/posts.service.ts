import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { Post } from "./post.model";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: Post[] }>(
        "http://localhost:3000/api/posts"
      )
      .pipe(
        map((data) => {
          return data.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post["_id"],
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

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string; id: string }>(
        "http://localhost:3000/api/posts",
        post
      )
      .subscribe((responseData) => {
        post.id = responseData.id;

        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(id: string) {
    this.http
      .delete(`http://localhost:3000/api/posts/${id}`)
      .subscribe((response) => {
        console.log(response);
        const updatedPosts = this.posts.filter((post) => post.id != id);
        this.posts = [...updatedPosts];
        this.postsUpdated.next([...this.posts]);
      });
  }
}
