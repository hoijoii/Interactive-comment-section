import { defineStore } from 'pinia'
import _ from 'lodash'
import { IComment, IReplies, IUser } from '@/types/comments'
import { IDialogTarget } from '@/types/dialogs'

export const useCommentsStore = defineStore('commentsStore', {
  state: () => ({
    currentUser: _.cloneDeep(require('@/assets/data/data.json')).currentUser as IUser,
    comments: _.cloneDeep(require('@/assets/data/data.json')).comments as Array<IComment>,
    target: { 
      comment_id: 0,
      reply_id: 0,
    } as any,
  }),
  actions: {
    addComment(comment: IComment) {
      this.comments.push(comment)
    },

    updateComment(comment_id: number, comment_content: string) {
      let comment : IComment | any = this.findComment(comment_id)
      comment.content = comment_content
    },

    deleteComment(target: IDialogTarget) {
      let comment : IComment | any = this.findComment(target.comment_id)

      if (!target.reply_id) {
        this.comments.splice(comment.id-1, 1)
      }
      else {
        let replyIdx : number = _.findIndex(comment.replies, { 'id': target.reply_id })
        comment.replies.splice(replyIdx, 1)
      }
    },

    addReply(comment_id:number, reply: IReplies) {
      this.findComment(comment_id)?.replies.push(reply)
    },

    updateReply(comment_id: number, reply_id: number, reply_content: string) {
      let comment : IComment | any = this.findComment(comment_id)
      _.find(comment.replies, { 'id' : reply_id }).content = reply_content
    },

    deleteReply(target: IDialogTarget) {
      let comment : IComment | any = this.findComment(target.comment_id)
      const replyIdx : number = _.findIndex(comment.replies, { 'id': target.reply_id })
      comment.replies.splice(replyIdx, 1)
    },

    pmScore(operate: string, comment_id: number, reply_id?: number) {
      let comment: IComment | any = this.findComment(comment_id)
      if (!reply_id) {
        operate === 'plus' ? comment.score += 1 
                      : (comment.score !== 0 ? comment.score -= 1 : null)
      } 
      else {
        let targetReply: IReplies = comment.replies[_.findIndex(comment.replies, { 'id': reply_id })]
        operate === 'plus' ? targetReply.score += 1 
                      : (targetReply.score !== 0 ? targetReply.score -= 1 : null)
      }
    },

    // utils
    findComment(comment_id : number) {
      return _.find(this.comments, { 'id': comment_id+1 })
    },

    resetTarget() {
      this.target = { comment_id: 0, reply_id: 0 }
    }
  }
})