const Router = require("express").Router;
const router = new Router();

const Message = require("../models/message.js");
const { ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");


/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get("/:id", ensureLoggedIn, async function (req, res, next){
    try{
        let mail= await Message.get(req.params.id);
        return res.json({ mail })
    } catch(e){
        return next(e)
    }
})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", ensureCorrectUser, async function (req, res, next){
    try{
        let mail = await Message.create({
            from_username:req.user.username,
            to_username: req.body.to_username,
            body: req.body.body
        })
        return res.json({ message: mail})

    }catch(e){
        return next(e)
    }
})


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post("/:id/read", ensureLoggedIn, async function (req, res, next){
    try{
        let username = req.user.username;
        let mail = await Message.get(req. params.id);

        if(mail.to_user.username !== username) {
            throw new ExpressError("error wrong user", 404);
        }
        let msg = await Message.markRead(req.params.id);

        return res.json({msg});
    } catch(e){
        return next(e)
    }
})

module.exports = router;