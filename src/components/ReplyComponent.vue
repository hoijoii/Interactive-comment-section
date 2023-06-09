<template>
  <div>
    <div class="comment">
      <div class="comment-content">
        <div class="score flex-item">
          <div class="score-wrapper">
            <PlusIcon @click="commentsStore.pmScore('plus', comment_id, id)" class="plus" />
            <div class="num">{{ score }}</div>
            <MinusIcon @click="commentsStore.pmScore('minus', comment_id, id)" class="minus"/>
          </div>

          <!-- mobile ui -->
          <comment-options 
                  :user="user"
                  :comment_id="comment_id"
                  :reply_id="id"
                  @replyBtn="replyBtn"
                  @editBtn="editFormShow = !editFormShow"
                  ref="replyOption"
                  class="options"
            />
        </div>

        <div class="content-wrapper">
          <div class="top">
            <img :src="require(`@/assets/images/avatars/${user.image.png}`)" class="profile"/>
            <div class="mg-lft13 name">{{ user.username }}</div>
            <div v-if="user.username === commentsStore.currentUser.username" class="mg-lft13 you">you</div>
            <div class="mg-lft13 grayish-blue">{{ setDateFormat(createdAt) }}</div>

            <!-- desktop ui -->
            <comment-options 
                  :user="user"
                  :comment_id="comment_id"
                  :reply_id="id"
                  @replyBtn="replyBtn"
                  @editBtn="editFormShow = !editFormShow"
                  ref="replyOption"
                  class="options"
            />
          </div>
          <div class="body">
            <div class="text grayish-blue" v-if="!editFormShow">
              <span class="replying-to">@{{ replyingTo }}</span>
              {{ content }}
            </div>
            <div v-else class="edit-input">
              <textarea class="edit-area" v-model="editContent"/>
              <button class="submit-btn update mg-auto" @click="updateBtn">UPDATE</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div>
      <div class="add-reply" v-if="replyFormShow">
        <input-form
          :comment_id="comment_id"
          :isReply=true
          :replyOption="replyOption ? replyOption : {}"
          @submit="replyFormShow=false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, Ref, defineProps, defineEmits, onMounted } from 'vue'
import CommentOptions from './CommentOptions.vue'
import InputForm from './InputForm.vue'
import PlusIcon from '../assets/images/icon-plus.svg'
import MinusIcon from '../assets/images/icon-minus.svg'
import { useCommentsStore } from '@/stores/comments'
import StringUtils from '@/utils/string-utils'

// pinia stores
const commentsStore = useCommentsStore()

// props & emits
const props = defineProps({
  comment_id: Number,
  id: Number,
  content: String,
  createdAt: String,
  score: Number,
  user: {
    Type: Object,
    default: {
      image: { png: '', webp: ''},
      username: ''
    }
  },
  replyingTo: String,
})

const emit = defineEmits(['plus', 'minus'])
const replyOption = ref(null)
const replToRepl :Ref<string> = ref('')

const setReplToRepl = () => {
  replToRepl.value = replyOption.value ? replyOption.value.replyingTo : ''
}

// filter
const setDateFormat = (date: string) => {
  return StringUtils.dateFormat(date)
}

// show or not input form
const replyFormShow: Ref<boolean> = ref(false)
const editFormShow: Ref<boolean> = ref(false)

const editContent: Ref<string> = ref(props.content)

// update button click event
const updateBtn = () => {
  commentsStore.updateReply(props.comment_id, props.id, editContent.value)
  editFormShow.value = false
}

// reply button click event
const replyBtn = () => {
  replyFormShow.value = !replyFormShow.value
  setReplToRepl()
}

</script>