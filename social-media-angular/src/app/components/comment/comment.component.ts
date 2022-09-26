import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {Post} from 'src/app/interfaces/post';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import {UserService} from "../../services/user.service";
import { Comment } from 'src/app/interfaces/comment';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  commentForm = new FormGroup({
    text: new FormControl(''),
  })
  user: User =this.authService.currentUser

  @Input('comment') inputComment: Post | any;
  editToComment: boolean = false;
  creatorUser: boolean = false;
  @Output() delete: EventEmitter<Post> = new EventEmitter();

  constructor(private postService: PostService,
              private authService: AuthService,
              private userService: UserService) {}

  ngOnInit(): void {
    if (this.inputComment.user.userId === this.authService.currentUser.userId) {
      this.creatorUser = true;
    }

    this.commentForm.get('text')?.patchValue(this.inputComment.text);

    this.userService.GetUser(this.inputComment.user.userId).subscribe({
      next: user => {
        this.inputComment.user = user;
      }
    })
  }

  toggleEditToComment = () => {
    this.editToComment = !this.editToComment
  }

  deleteComment = () => {
    this.postService.deletePost(this.inputComment.postId).subscribe({
        next: data => {
          this.delete.emit(this.inputComment);
        },
        error: err => console.log(err)
    })

    this.getComments()
  }

  newPost: Post = {
    text:  "",
    title: "",
    imageUrl: "string",
    user: {
        userId:  0
    }
}

comments: Post[] = [{
  postId: 0,
  text: this.commentForm.value.text || "",
  title: "",
  imageUrl: "string",
  user: {
      userId:  this.authService.currentUser.userId||0
  }
}]

commentConnect: Comment ={
  commentId: 0,
  postId: 0
}

  toggleReplyToComment = () => {
    this.replyToComment = !this.replyToComment
  }

  getComments=()=>{
    this.postService.getByComments(this.inputComment.postId||1).subscribe((post)=> {
      this.comments = post
    })
  }

  submitReply = (e: any) => {
  //  e.preventDefault();
 //   let newComment: Post = {
 //     postId: this.inputComment.postId,
 //     imageUrl: "",
 //     text: `${this.commentForm.value.text}`,
 //     title: "",
 //     user: this.inputComment.user
 //   }
    //let newComment = new Post(0, this.commentForm.value.text || "", "", this.authService.currentUser, [])
    this.postService.updatePost(newComment, this.inputComment.postId )
 //     .subscribe({
//         next: (response) => {
//          this.inputComment = newComment;
//          this.toggleEditToComment();
//        },
//        error: err => console.log(err)
 //     })

    e.preventDefault()
    this.newPost.text = this.commentForm.value.text || ""
    this.newPost.title = "hallo"
    this.newPost.imageUrl= ".../assets/images/favicon.png"
    this.newPost.user.userId =this.authService.currentUser.userId||0
    this.postService.postPost(this.newPost)
      .subscribe(
        (response) => {
          this.newPost = response
          this.commentConnect.commentId = this.newPost.postId||0
          this.commentConnect.postId = this.inputComment.postId||0
          this.postService.postComment(this.commentConnect).subscribe( (response) => {this.getComments()})
          this.toggleReplyToComment()
        }
      )

  }
}
