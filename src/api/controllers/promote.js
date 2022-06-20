const promoteToAdmin = async (req, res) => {
    try{
      const user = await User.findById(req.body.user_id);
      user.role = admin;
      await user.save();
      res.status(200).json({
          "message":"User has been promoted to Admin",
          "data":user
      })
    }catch(e){
      res.status(500).json({
          "message":"Server error",
          "data":e
      })
    }
    }

    module.exports = {promoteToAdmin}