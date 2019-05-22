import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../post.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('postId')) {
        this.isEdit = true;
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
        });
      } else {
        this.postId = null;
      }
    });
  }

  savePost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }
    if (!this.isEdit) {
      this.postService.createPost({
        id: null,
        title: postForm.value.title,
        content: postForm.value.content
      });
    } else {
      this.postService.editPost(
        this.postId,
        postForm.value.title,
        postForm.value.content
      );
    }
    this.router.navigate(['/']);
    postForm.resetForm();
  }
}
