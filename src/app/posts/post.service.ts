import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './posts.model';
import { isObject } from 'util';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient, private router: Router) {}

  posts: Post[] = [];
  postAdded = new Subject<void>();
  maxPostCount: number;

  createPost(post): void {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image, post.title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/posts',
        postData
      )
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  getPostsFromServer(postPerPage: number, currentPage: number): void {
    const queryParams = `?pageSize=${postPerPage}&currentPage=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPostCount: number }>(
        'http://localhost:3000/posts' + queryParams
      )
      .pipe(
        map(postsData => {
          return {
            posts: postsData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath
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

  getPost(id) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>('http://localhost:3000/posts/' + id);
  }

  editPost(id: string, title: string, content: string, image): void {
    let postData;
    if (isObject(image)) {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id, title, content, imagePath: image };
    }
    this.http
      .put('http://localhost:3000/posts/' + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePost(id) {
    return this.http.delete('http://localhost:3000/posts/delete/' + id);
  }
}
