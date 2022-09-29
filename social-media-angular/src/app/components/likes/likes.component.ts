import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { User } from 'src/app/interfaces/user';
import { Like } from '../../interfaces/like'
import {LikesService } from '../../services/likes.service'

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.css']
})
export class LikesComponent implements OnInit {

  user: User =this.authService.currentUser;

  likePost: boolean = false

  constructor(private authService: AuthService, private likesService: LikesService, private postService: PostService) { }

  ngOnInit(): void {
    this.getLikes()
  }

  newLike: Like = {
    liked: true,
    post: {
      postId: 0
    },
    user:{
      userId: this.authService.currentUser.userId||0
    }
  }

  like: Like[] = [{
    liked: true,
    post:{
      postId: 0
    },
    user: {
      userId:  this.authService.currentUser.userId||0
  }
  }]

  dislikes: Like[] = [{
    liked: true,
    post:{
      postId: 0
    },
    user: {
      userId:  this.authService.currentUser.userId||0
  }
  }]

  toggleLikeComment = () => {
    this.likePost = true
  }

  getLikes=()=>{
    this.likesService.GetByPostId(this.postService.currentPost.postId || 0).subscribe((likes: Array<Like[]>)=>{
      for(let newLike of likes){
        if(this.newLike.liked){
          this.like = newLike
        }else{
          this.dislikes = newLike
        }
      }
      })
  }

  submitLike =(e:any) => {
    this.newLike.liked = true;
    this.newLike.post.postId = this.postService.currentPost.postId || 0
    this.newLike.user.userId = this.authService.currentUser.userId || 0
    this.likesService.CreateLike(this.newLike)
    .subscribe(
      (response) => {
        this.newLike = response
        this.likesService.CreateLike(this.newLike).subscribe((response)=> {this.getLikes()})
        this.toggleLikeComment()
      }
    )
  }
}
