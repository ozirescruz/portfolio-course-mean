import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit {
  mode = "create";
  private postId: string;
  post: Post;
  imagePreview: string;

  form: FormGroup = new FormGroup({
    title: new FormControl(null, {
      validators: [Validators.required],
    }),
    content: new FormControl(null, {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    image: new FormControl(null, {
      validators: [Validators.required],
      asyncValidators: [mimeType],
    }),
  });

  constructor(
    public postsService: PostsService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.mode = "edit";
        this.postId = paramMap.get("id");
        this.postsService.getPost(this.postId).subscribe((post) => {
          this.post = {
            id: this.postId,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
            creator: this.authService.getUserid(),
          };

          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
        this.post = {
          id: null,
          title: "",
          content: "",
          imagePath: "",
          creator: "",
        };
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
