import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './posts.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) {}

  posts: Post[] = [];
  postAdded = new Subject<void>();

  createPost(post) {
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/posts',
        post
      )
      .subscribe(res => {
        post.id = res.postId;
        this.posts.push(post);
        this.postAdded.next();
      });
  }

  getPostsFromServer() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/posts')
      .pipe(
        map(postsData => {
          return postsData.posts.map(post => {
            return { title: post.title, content: post.content, id: post._id };
          });
        })
      )
      .subscribe(posts => {
        this.posts = posts;
        this.postAdded.next();
      });
  }

  getPosts() {
    return [...this.posts];
  }

  getPost(id) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
    }>('http://localhost:3000/posts/' + id);
  }

  editPost(id: string, title: string, content: string) {
    const post = { id, title, content };
    this.http
      .put('http://localhost:3000/posts/' + id, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPost = this.posts.findIndex(post => post.id === id);
        updatedPosts[oldPost] = post;
        this.posts = updatedPosts;
        this.postAdded.next();
      });
  }

  deletePost(id) {
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
