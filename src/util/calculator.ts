import { SCORE_ENUM } from 'src/posts/posts.enum';

export const calculatorScore = (
  viewCount: number,
  likeCount: number,
  commentCount: number,
): number => {
  return (
    viewCount * SCORE_ENUM.BOARD_VIEW_SCORE +
    likeCount * SCORE_ENUM.BOARD_LIKE_CREATE_SCORE +
    commentCount * SCORE_ENUM.BOARD_COMMENT_CREATE_SCORE
  );
};
