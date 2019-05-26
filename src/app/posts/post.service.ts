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
        const newPost: Post = {
          id: response.post.id,
          title: post.title,
          content: post.content,
          imagePath: response.post.imagePath
        };
        this.posts.push(newPost);
        this.postAdded.next();
        this.router.navigate(['/']);
      });
  }

  getPostsFromServer(): void {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/posts')
      .pipe(
        map(postsData => {
          return postsData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          });
        })
      )
      .subscribe(posts => {
        this.posts = posts;
        this.postAdded.next();
      });
  }

  getPosts(): Post[] {
    return [...this.posts];
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
        const updatedPosts = [...this.posts];
        const oldPost = this.posts.findIndex(post => post.id === id);
        const post = {
          id,
          title,
          content,
          imagePath: image
        };
        updatedPosts[oldPost] = post;
        this.posts = updatedPosts;
        this.postAdded.next();
        this.router.navigate(['/']);
      });
  }

  deletePost(id): void {
    this.http
      .delete('http://localhost:3000/posts/delete/' + id)
      .subscribe(() => {
        this.posts = this.posts.filter(post => {
          return post.id !== id;
        });
        this.postAdded.next();
      });
  }
}
