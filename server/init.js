// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let Comment = require('./models/comments')
let User = require('./models/user')


let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let tags = [];
let answers = [];

function commentCreate(text, authorId, question_id, answer_id, ask_date_time, votes) {
    let commentDetail = {
        text: text,
        authorId: authorId
    };

    if (question_id != false) commentDetail.question_id = question_id;
    if (answer_id != false) commentDetail.answer_id = answer_id;
    if (ask_date_time != false) commentDetail.ask_date_time = ask_date_time;
    if (votes != false) commentDetail.votes = votes;

    let comment = new Comment(commentDetail);
    return comment.save();
}

function userCreate(first_name, last_name, email, reputation, passwordHash, isAdmin) {
    let userDetail = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        passwordHash: passwordHash,
        isAdmin: isAdmin
    };

    if (reputation != false) userDetail.reputation = reputation;
    
    let user = new User(userDetail);
    return user.save();
} 

function tagCreate(name, createdBy) {
    let tag = new Tag({ name: name, createdBy: createdBy });
    return tag.save();
}

function answerCreate(text, ans_by, ans_date_time, votes, comment) {
    answerdetail = { 
        text: text,
        ans_by: ans_by 
    };
    
    if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
    if (votes != false) answerdetail.votes = votes;
    if (comment != false) answerdetail.comment = comment;

    let answer = new Answer(answerdetail);
    return answer.save();
}

function questionCreate(title, summary, text, tags, answers, asked_by, ask_date_time, views, votes, comment) {
    qstndetail = {
        title: title,
        summary: summary,
        text: text,
        tags: tags,
        askedBy: asked_by
    };
    if (answers != false) qstndetail.answers = answers;
    if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
    if (views != false) qstndetail.views = views;
    if (votes != false) qstndetail.votes = votes;
    if (comment != false) qstndetail.comment = comment;

    let qstn = new Question(qstndetail);
    return qstn.save();
}

const populate = async () => {
        // Creating Admin
        let u0 = await userCreate('admin', 'user', 'adminuser@gmail.com', 100, 'i_am_admin', true)

        // Creating users
        let u1 = await userCreate('John', 'Doe', 'john.doe@example.com', 100, "p1", false);
        let u2 = await userCreate('Jane', 'Doe', 'jane.doe@example.com', 150, "p2", false);

        // Creating tags
        let t1 = await tagCreate('react', u1._id);
        let t2 = await tagCreate('javascript', u1._id);
        let t3 = await tagCreate('android-studio', u2._id);
        let t4 = await tagCreate('shared-preferences', u2._id);

        // Creating comments Answers c1-c4
        let c1 = await commentCreate('This is a very insightful response.', u1._id);
        let c2 = await commentCreate('Could you provide more details on this part?', u2._id);
        let c3 = await commentCreate('I think there might be a simpler solution to this.', u1._id);
        let c4 = await commentCreate('Excellent solution, thanks for sharing!', u2._id);
        //added new comments Questions c5-c9
        let c5 = await commentCreate('Test Comment 1', u1._id);
        let c6 = await commentCreate('Test Comment 2', u1._id);
        let c7 = await commentCreate('Test Comment 3', u1._id);
        let c8 = await commentCreate('Test Comment 4', u1._id);
        let c9 = await commentCreate('Test Comment 5', u1._id);
        // Creating answers with comments
        let a1 = await answerCreate('This is how you can use React Router to program navigations.', u1._id, new Date(), 10, c1._id);
        let a2 = await answerCreate('Here are some tips on managing history objects in your React applications.', u2._id, new Date(), 5, c2._id);
        let a3 = await answerCreate('apply() is indeed better for asynchronous preference updates.', u2._id, new Date(), 15, c3._id);
        let a4 = await answerCreate('Example of saving data using SharedPreferences in Android.', u1._id, new Date(), 20, c4._id);
        

        await Answer.findByIdAndUpdate(a1._id, {
            $push: { comments: c1._id }
        });

        await Answer.findByIdAndUpdate(a2._id, {
            $push: { comments: c2._id }
        });

        await Answer.findByIdAndUpdate(a3._id, {
            $push: { comments: c3._id }
        });

        await Answer.findByIdAndUpdate(a4._id, {
            $push: { comments: c4._id }
        });


        // Creating questions with answers and comments
        let q1 = await questionCreate(
            'Programmatically navigate using React router', 
            'Using React Router for navigation in your React application.', 
            'Details on how React Router can be used for navigation.', 
            [t1._id, t2._id], 
            [a1._id, a2._id], 
            u1._id, 
            new Date(), 
            150, 
            20, 
            [c5._id, c7._id, c9._id]
        );
        
        let q2 = await questionCreate(
            'android studio save string shared preference, start activity and load the saved string', 
            'Managing SharedPreferences in Android Studio.', 
            'How to save and load strings using SharedPreferences in Android Studio.', 
            [t3._id, t4._id], 
            [a3._id, a4._id], 
            u2._id, 
            new Date(), 
            100, 
            30, 
            [c6._id, c8._id]
        );

        await Question.findByIdAndUpdate(q1._id, {
            $push: {
                comments: {
                    $each: [c5._id, c7._id, c9._id]  // Using $each to push multiple items
                }
            }
        });

        await Question.findByIdAndUpdate(q2._id, {
            $push: {
                comments: {
                    $each: [c6._id, c8._id]  // Using $each to push multiple items
                }
            }
        });

    if (db) db.close();
    console.log('done');
}

populate()
    .catch((err) => {
        console.log('ERROR: ' + err);
        if (db) db.close();
    });

console.log('processing ...');
