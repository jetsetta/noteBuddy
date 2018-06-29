router.get("/detail/:note_id", (req, res) => {

  Note.findOne({
      _id: req.params.note_id
    })
    .populate("topic")
    .populate("user")
    .then(note => {
      Comment.find({
          note: note._id
        }).populate("user")
        .then(comments => {
  
            if (comments.length > 0) {
              comments.forEach(comment => {
                if (comment.user._id == req.user.id) {
                  comment.is_editable = true
                }
                res.render("notes/detail", {
                  note: note,
                  comments: comments
                })
              })
            } else {
              res.render("notes/detail", {
                note: note,
              })
  
  
  
        }
    }).catch(err => {
      
      res.render("notes/detail", {
        note: note,
  
      })
   
    })
  }).catch(err => {
  errors = []
  errors.push(err)
  
  res.render("notes/detail", {
    note: note,
    errors: errors
  })
  })
  
  })
  