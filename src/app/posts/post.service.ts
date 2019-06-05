import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { isObject } from 'util';
import { NotificationService } from '../shared/notification.service';
import { Post } from './posts.model';

const POSTS_URL = environment.API_URL + '/posts';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  posts: Post[] = [];
  postAdded = new Subject<void>();
  maxPostCount: number;

  createPost(post): void {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image, post.title);
    this.http
      .post<{ message: string; post: Post }>(POSTS_URL, postData)
      .subscribe(response => {
        this.notifyChanges('added');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 500);
      });
  }

  getPostsFromServer(postPerPage: number, currentPage: number): void {
    const queryParams = `?pageSize=${postPerPage}&currentPage=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPostCount: number }>(
        POSTS_URL + queryParams
      )
      .pipe(
        map(postsData => {
          return {
            posts: postsData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                owner: post.owner
              };
            }),
            maxPostCount: postsData.maxPostCount
          };
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts.posts;
        this.maxPostCount = transformedPosts.maxPostCount;
        this.postAdded.next();
      });
  }

  getPosts(): Post[] {
    return [...this.posts];
  }

  getMaxCount() {
    return this.maxPostCount;
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      owner: string;
    }>(POSTS_URL + '/' + id);
  }

  editPost(id: string, title: string, content: string, image): void {
    let postData: Post | FormData;
    if (isObject(image)) {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id, title, content, imagePath: image, owner: null };
    }
    this.http.put(POSTS_URL + '/' + id, postData).subscribe(response => {
      this.notifyChanges('updated');
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 500);
    });
  }

  deletePost(id: string) {
    this.notifyChanges('deleted');
    return this.http.delete(POSTS_URL + '/delete/' + id);
  }

  private notifyChanges(action: string) {
    this.notificationService.showSuccess('Post ' + action + ' successfully.');
  }
}
