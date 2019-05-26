import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { Post } from '../posts.model';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  subscription: Subscription;
  isLoading = false;
  postCount = 10;
  postPerPage = 3;
  pageSizeOptions = [1, 3, 5, 10];

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.subscription = this.postService.postAdded.subscribe(() => {
      this.isLoading = false;
      this.posts = this.postService.getPosts();
    });
    this.postService.getPostsFromServer();
    this.posts = this.postService.getPosts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deletePost(id) {
    this.postService.deletePost(id);
  }

  onPageChange(pageData: PageEvent) {}
}
