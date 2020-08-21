import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 6];
  currentPage = 1;
  userId: string;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserid();

    this.postsService.getPosts(
      this.postsPerPage.toString(),
      this.currentPage.toString()
    );
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((data: { posts: Post[]; postCount: number }) => {
        this.posts = data.posts;
        this.totalPosts = data.postCount;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  delete(id: string) {
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(
        this.postsPerPage.toString(),
        this.currentPage.toString()
      );
    });
  }

  onPageChange(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;

    this.postsService.getPosts(
      this.postsPerPage.toString(),
      this.currentPage.toString()
    );
  }
}
