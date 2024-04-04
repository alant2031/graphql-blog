import { comments } from '../../../db.json';
import { dateISOtoMySQL } from '../utils/date-iso-to-mysql';
import { knex } from '../';

const commentsForDb = comments.map((comment) => {
  return {
    comment: comment.comment,
    user_id: comment.userId,
    post_id: comment.postId,
    created_at: dateISOtoMySQL(comment.createdAt),
  };
});

// knex('comments')
//   .insert(commentsForDb)
//   .then((r) => {
//     console.log(r);
//   })
//   .catch((e) => console.log(e))
//   .finally(() => knex.destroy());
