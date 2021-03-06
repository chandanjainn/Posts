import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { Post } from '../posts.model';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  subscription: Subscription;
  isLoading = false;
  postCount = 0;
  postPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 3, 5, 10];
  userId: string;

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPostsFromServer(this.postPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.subscription = this.postService.postAdded.subscribe(() => {
      this.isLoading = false;
      this.posts = this.postService.getPosts();
      this.userId = this.authService.getUserId();
      this.postCount = this.postService.getMaxCount();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deletePost(id) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPostsFromServer(this.postPerPage, this.currentPage);
      this.posts = this.postService.getPosts();
    });
    this.isLoading = true;
  }

  onPageChange(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPostsFromServer(this.postPerPage, this.currentPage);
    this.isLoading = false;
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
