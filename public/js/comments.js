let Comment = function(){
  this.feedbacks=[];
}

Comment.prototype.getSavedFeedback = function () {
  let storedFeedbacks=fs.readFileSync('./data/feedback.json','utf8');
  if (!storedFeedbacks) {
    return this.feedbacks;
  }
  return this.feedbacks = JSON.parse(storedFeedbacks);
};
exports.Comment=Comment;
