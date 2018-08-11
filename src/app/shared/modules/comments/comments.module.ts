import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './comments.component';
import { CommentComponent } from './comment/comment.component';
import { EditorComponent } from './editor/editor.component';
import { FormsModule } from '@angular/forms';
import { CommentItemComponent } from './comment-item/comment-item.component';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { CommentService } from '../../services/comment.service';
import { MomentModule } from 'angular2-moment/moment.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MomentModule,
        SharedPipesModule
    ],
    declarations: [
        CommentsComponent,
        CommentComponent,
        CommentItemComponent,
        EditorComponent
    ],
    exports: [
        CommentsComponent,
        CommentComponent,
        EditorComponent
    ],
    providers: [
        CommentService,
    ]
})
export class CommentsModule { }
