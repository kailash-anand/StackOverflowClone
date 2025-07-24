// Application server
// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const Question = require('./models/questions');
const Answers = require('./models/answers');
const Tags = require('./models/tags');
const Comments = require('./models/comments');
const Users = require('./models/user');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/fake_so', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

//GET

app.get("/api/questions", async (req, res) => {
  try {
    const items = await Question.find();

    if (!items) {
      return res.status(404).json({ message: "No items found" });
    }

    res.status(200).json(items);
  }
  catch (error) {
    console.log("Error fetching items: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

app.get("/api/questions/:id", async (req, res) => {
	try {
		const questionId = req.params.id
		const question = await Question.findOne({_id: questionId})

		if (!question) {
			return res.status(404).json({ message: "Question not found" });
		}

		res.status(200).json(question)
	}
	catch (error) {
		console.error("Error fetching items: ", error)
		res.status(500).json({ message: "Internal server error"})
	}
})

app.get("/api/getQuestionCount", async (req, res) => {
  try {
    const count = await Question.countDocuments()
    res.status(200).json(count)
  }
  catch (error) {
    console.log("Error fetching items: ", error)
    res.status(500).json({message: "Internal server error"})
  }
})

app.get("/api/getQuestionTags/:questionId", async (req, res) => {
  try {
    const questionId = req.params.questionId
    const question = await Question.findOne({_id: questionId})
    let tags = []
    
    for (const tagId of question.tags) {
      const tag = await Tags.findOne({_id: tagId})
      tags.push(tag)
    }

    res.status(200).json(tags)
  }
  catch (error) {
    console.error("Error fecthing items: ", error)
    res.status(500).json({message: "Internal server error"})
  }
})

app.get("/api/questions/:id/answers", async (req, res) => {
	try {
		const questionId = req.params.id
		const question = await Question.findOne({_id: questionId})
		let answers = []

		for (const answerId of question.answers) {
			const answer = await Answers.findOne({_id: answerId})
			answers.push(answer)
		}

		res.status(200).json(answers)
	}
	catch (error) {
		console.log("Error fetching items: ", error);
		res.status(500).json({ message: "Internal server error" });
  	}
})

app.get("/api/answers", async (req, res) => {
  try {
    const items = await Answers.find();

    if (!items) {
      return res.status(404).json({ message: "No items found" });
    }

    res.status(200).json(items);
  }
  catch (error) {
    console.log("Error fetching items: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

app.get("/api/tags", async (req, res) => {
  try {
    const items = await Tags.find();

    if (!items) {
      return res.status(404).json({ message: "No items found" });
    }

    res.status(200).json(items);
  }
  catch (error) {
    console.log("Error fetching items: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

app.get("/api/tags/count", async (req, res) => {
	try {
		const count = await Tags.countDocuments()
		res.status(200).json(count)
	} 
	catch (error) {
		console.error("Error fetching items: ", error)
		res.status(500).json({ message: "Internal server error "})
	}
})

app.get("/api/tags/:id/question_count", async (req, res) => {
	try {
		const tagId = req.params.id
		const questionCount = await Question.countDocuments({ tags: tagId })
		res.status(200).json(questionCount)
	}
	catch (error) {
		console.error("Error fetching items: ", error)
		res.status(500).json({ message: "Internal server error "})
	}
})

app.get("/api/comments", async (req, res) => {
  try {
    const items = await Comments.find();

    if (!items) {
      return res._construct.status(404).json({ message: "No items found" });
    }

    res.status(200).json(items);
  }
  catch (error) {
    console.log("Error fetching items: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

app.get("/api/users", async (req, res) => {
  try {
    const items = await Users.find();

    if (!items) {
      return res._construct.status(404).json({ message: "No items found" });
    }

    res.status(200).json(items);
  }
  catch (error) {
    console.log("Error fetching items: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

app.get("/api/verifyUserEmail/:email", async (req, res) => {
	try {
		const userEmail = req.params.email
		const user = await Users.findOne({email: userEmail})

		if (user) {
			return res.status(401).json({message: "User exists"})
		}

		return res.status(200).json({message: "Success"})
	}
	catch (error) {
		console.error("Error fetchig items: ", error)
		res.status(500).json({message: "Internal server error"})
	}
})

app.get("/api/getUserByEmail/:email", async (req, res) => {
	try {
		const userEmail = req.params.email
		const user = await Users.findOne({email: userEmail})

		if (user) {
			return res.status(200).json({message: "User found", data: user})
		}

		return res.status(404).json({message: "User not found"})
	}
	catch (error) {
		console.error("Error fetching items: ", error)
		res.status(500).json({message: "Internal server error"})
	}
})

app.get("/api/getUserById/:userId", async (req, res) => {
  try {
    const userId = req.params.userId
    const user = await Users.findOne({_id: userId})

    if (user) {
      return res.status(200).json({message: "User found", data: user})
    }

    return res.status(404).json({message: "User not found"})
  }
  catch (error) {
    console.error("Error fetching items: " + error)
    res.status(500).json({message: "Internal server error"})
  }
})


//POST

app.post("/api/question", async (req, res) => {
	try {
		const { title, summary, text, tags, askedBy, ask_date_time } = req.body;

		if (!title || !askedBy || !text || !tags) {
			return res.status(400).json({ message: "Required fileds" });
		}

		const user = await Users.findOne({email: askedBy})
		const userId = user._id

		let tagIds = []
		for (const tag of tags) {
			const tagExists = await Tags.findOne({name: tag})

			if (!tagExists) {
				const newTag = new Tags({
					name: tag,
					createdBy: userId
				})

				const savedTag = await newTag.save()
				tagIds.push(savedTag._id)
			}
			else {
				tagIds.push(tagExists._id)
			}
		}

		const newQuestion = new Question({
			title: title,
			summary: summary,
			text: text,
			tags: tagIds,
			answers: [],
			askedBy: userId,
			ask_date_time: ask_date_time,
			views: 0,
			votes: 0,
			comments: []
		});

		const savedQuestion = await newQuestion.save();
		res.status(201).json(savedQuestion);
	}
	catch (error) {
		console.log("Error creating question: ", error);
		res.status(500).json({ message: "Internal server error" });
	}
})

app.post("/api/answers/:questionId", async (req, res) => {
  	try {
		const questionId = req.params.questionId
		const { text, ans_by } = req.body;

		if (!text || !ans_by) {
			return res.status(400).json({ message: "Text and ans_by fields are required" });
		}

		const user = await Users.findOne({email: ans_by})
		const question = await Question.findOne({_id: questionId})

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		else if (!question) {
			return res.status(404).json({ message: "Question not found" });
		}

		const userId = user._id
		const ans_date_time = new Date();

		const newAnswer = new Answers({
			text: text,
			ans_by: userId,
			ans_date_time: ans_date_time,
			votes: 0,
			comments: []
		});

		const savedAnswer = await newAnswer.save(); 
		
		question.answers.push(savedAnswer._id)
		await question.save()

		res.status(201).json(savedAnswer);
  	} catch (error) {
		console.error("Error creating answer:", error);
		res.status(500).json({ message: "Internal server error" });
  	}
});

app.post("/api/addTag", async (req, res) => {
  try {
    const { name, createdBy } = req.body;

    if (!name || !createdBy) {
      return res.status(400).json({ message: "Required fields" });
    }

    const newTag = new Tags({
      name,
      createdBy
    });

    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  }
  catch (error) {
    console.log("Error creating question: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

app.post("/api/addUser", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Required fields" });
    }

    const newUser = new Users({
      first_name,
      last_name,
      email,
      reputation: 50,
      passwordHash: password
      //should I add REPUTATION HERE
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  }
  catch (error) {
    console.log("Error creating question: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

app.post('/api/addComment', async (req, res) => {
  try {
    const { text, authorId } = req.body;
    console.log("Received comment data:", req.body);
    if (!text || !authorId) {
      return res.status(400).json({ message: "Required fields" });
    }

    const newComment = new Comments({
      text,
      authorId,
      ask_date_time: Date.now(),
      votes: 0
    });

    const savedComment = await newComment.save();

    res.status(201).json(savedComment);
  }
  catch (error) {
    console.error("Error saving comment: ", error);
    res.status(500).json({ error: 'Server error' });
  }
})

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (!email && password) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (email && !password) {
    return res.status(400).json({ message: "Password are required" });
  }


  try {
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Incorrect email" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful", user: { email: user.email, firstName: user.first_name, lastName: user.last_name, reputation: user.reputation, isAdmin: user.isAdmin} });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/api/users/emails', async (req, res) => {
  try {
    const users = await Users.find().select('email -_id'); // Select only the email field
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch emails", error: error.toString() });
  }
});

//PUT

app.put('/api/tags/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const { name, createdBy } = req.body;

    // Check if the required 'name' field is provided
    if (!name) {
      return res.status(400).json({ message: "Required field 'name' is missing" });
    }

    const updateData = { name };

    // Optionally allow updating the 'createdBy' field if provided
    if (createdBy) {
      updateData.createdBy = createdBy;
    }

    // Find the tag by ID and update its attributes
    const updatedTag = await Tags.findByIdAndUpdate(
      tagId,
      updateData,
      { new: true } // This option instructs Mongoose to return the updated document
    );

    // Check if the tag was found and updated
    if (!updatedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    // Send the updated tag as the response
    res.status(200).json(updatedTag);
  } catch (error) {
    console.error("Error updating tag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.put('/api/questions/:id/answers', async (req, res) => {
  try {
    const questionId = req.params.id;
    const { answerId } = req.body;
    if (!answerId) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    // Update the question with the provided answer
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    question.answers.push(answerId);
    const updatedQuestion = await question.save();
    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/api/questions/:id/comments', async (req, res) => {
  try {
    const questionId = req.params.id;
    const { commentId } = req.body;

    // Check if the request body contains the required fields
    if (!commentId) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Add the new comment ID to the question's comments array
    question.comments.push(commentId);
    const updatedQuestion = await question.save();

    // Send the updated question as the response
    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/questions/:id/incr_views", async (req, res) => {
	try {
		const questionId = req.params.id
		const question = await Question.findOne({_id: questionId})

		if (!question) {
			return res.status(404).json({ message: "Question not found" });
		}

		question.views++
		const updatedQuestion = await question.save();

		res.status(200).json(updatedQuestion);
	}
	catch (error) {
		console.error("Error updating question:", error);
    	res.status(500).json({ message: "Internal server error" });
	}
})

app.put('/api/answers/:id/comments', async (req, res) => {
  try {
    const answerId = req.params.id;
    const { commentId } = req.body;

    // Check if the request body contains the required fields
    if (!commentId) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const answer = await Answers.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Add the new comment ID to the question's comments array
    answer.comments.push(commentId);
    const updatedAnswer = await answer.save();

    // Send the updated question as the response
    res.status(200).json(updatedAnswer);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put('/api/questions/:id', async (req, res) => {
  try {
    const questionId = req.params.id;
    const { title, summary, text, tags, views } = req.body;

    // Check if the request body contains the required fields
    if (!title || !summary || !text || !tags) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Find the question by ID and update its attributes
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { title, summary, text, tags, views },
      { new: true } // Return the updated document
    );

    // Check if the question was found and updated
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Send the updated question as the response
    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//DELETE
app.delete('/api/tags/:id', async (req, res) => {
  try {
    const tagId = req.params.id;

    const deletedTag = await Tags.findByIdAndDelete(tagId);

    if (!deletedTag) {
      console.log(tagId);
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error deleting Tag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete('/api/comments/:id', async (req, res) => {
  try {
    const commentId = req.params.id;
    const deletedComment = await Comments.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete('/api/answers/:id', async (req, res) => {
  try {
    const answerId = req.params.id;
    const deletedAnswer = await Answers.findByIdAndDelete(answerId);

    if (!deletedAnswer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    console.error("Error deleting answer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete('/api/questions/:id', async (req, res) => {
  try {
    const questionId = req.params.id;
    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete('/api/users/:id', async (req,res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await Users.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

    res.status(200).json({ message: "Question deleted successfully" });
    }
    catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
    }

});

const PORT = 8000;

app.listen(PORT, () => {
  console.log("Server listening on PORT 8000");
})


