import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../posts.model';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  isEdit = false;
  post: Post;
  postId: string;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('postId')) {
        this.isEdit = true;
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });
        });
      } else {
        this.postId = null;
      }
    });
  }

  savePost() {
    if (this.form.invalid) {
      return;
    }
    if (!this.isEdit) {
      this.isLoading = true;
      this.postService.createPost({
        id: null,
        title: this.form.value.title,
        content: this.form.value.content
      });
      this.isLoading = false;
    } else {
      this.isLoading = true;
      this.postService.editPost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
      this.isLoading = false;
    }
    this.router.navigate(['/']);
    this.form.reset();
  }

  pickImage(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }
}
