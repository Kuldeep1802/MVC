const { escapeXML } = require("ejs");
const UserModel = require("../models/User");
const bcrypt = require("bcrypt"); // for hide passwords
const jwt = require("jsonwebtoken"); // for securit passwords
const cloudinary = require("cloudinary").v2;
const courseModel = require("../models/course");

cloudinary.config({
  cloud_name: "dqipfliu2",
  api_key: "945217929638569",
  api_secret: "FWW81SJYPa_N4TK7uwd4IJQJ7Qs",
});

class Frontcontroller {
  static login = async (req, res) => {
    try {
      res.render("login", {
        msg: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static register = async (req, res) => {
    try {
      res.render("register", { msg: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };
  static dashboard = async (req, res) => {
    try {
      const { name, image, email, id } = req.userdata;
      // console.log(name)
      const btech = await courseModel.findOne({ user_id: id, course: "btech" });
      console.log(btech);
      res.render("dashboard", { n: name, i: image, e: email, b: btech });
    } catch (error) {
      console.log(error);
    }
  };
  static about = async (req, res) => {
    try {
      const { name } = req.userdata;
      res.render("about", { n: name });
    } catch (error) {
      console.log(error);
    }
  };
  static contact = async (req, res) => {
    try {
      const { name } = req.userdata;
      res.render("contact", { n: name });
    } catch (error) {
      console.log(error);
    }
  };
  static insertReg = async (req, res) => {
    try {
      const file = req.files.image;
      // console.log(file);
      // console.log(req.body);

      const uploadImage = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "profile",
      });

      console.log(uploadImage);

      const { n, e, p, cp } = req.body;
      const user = await UserModel.findOne({ email: e });
      // console.log(user)
      if (user) {
        req.flash("error", "email already exist");
        res.redirect("/register");
      } else {
        if (n && e && p && cp) {
          if (p == cp) {
            const hashpassword = await bcrypt.hash(p, 10);
            const result = new UserModel({
              name: n,
              email: e,
              password: hashpassword,
              image: {
                public_id: uploadImage.public_id,
                url: uploadImage.secure_url,
              },
            });
            await result.save();
            req.flash("success", "register success pls login");
            res.redirect("/"); // route url
          } else {
            req.flash("error", "Password and cpassword not same");
            res.redirect("/register");
          }
        } else {
          req.flash("error", "all field req");
          res.redirect("/register");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  static vlogin = async (req, res) => {
    try {
      // console.log(req.body)
      const { e, p } = req.body;
      if (e && p) {
        const user = await UserModel.findOne({ email: e });

        if (user != null) {
          const isMatched = await bcrypt.compare(p, user.password);
          if (isMatched) {
            if (user.role == 'admin') {
              // token
              let token = jwt.sign(
                { ID: user.id },
                "skabcsbcksdbcsdvbkdnckdbcs"
              );
              // console.log(token)
              res.cookie("token", token);

              res.redirect("/admin/deshboard");
            }
            // token
            let token = jwt.sign({ ID: user.id }, "skabcsbcksdbcsdvbkdnckdbcs");
            // console.log(token)
            res.cookie("token", token);

            res.redirect("/dashboard");
          } else {
            req.flash("error", "Email or password is not valid");
            res.redirect("/");
          }
        } else {
          req.flash("error", "You are not a registered user");
          res.redirect("/");
        }
      } else {
        req.flash("error", "All Fields Reguired");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
  static profile = async (req, res) => {
    try {
      const { name, image, email } = req.userdata;
      res.render("profile", { n: name, i: image, e: email });
    } catch (error) {
      console.log(error);
    }
  };
  static updateprofile = async (req, res) => {
    try {
      //console.log(req.files.image);
      const { id } = req.userdata;
      const { name, email, image } = req.body;
      if (req.files) {
        const user = await UserModel.findById(id);
        console.log(user);
        const imageID = user.image.public_id;
        console.log(imageID);

        // delete image from cloudnary
        await cloudinary.uploader.destroy(imageID);
        // new image
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "profile",
          }
        );
        console.log(imageupload);

        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      req.flash("success", "Update Successfully");
      res.redirect("/profile");
    } catch (error) {}
  };
  static changepassword = async (req, res) => {
    try {
      const { op, np, cp } = req.body;
      const { id } = req.userdata;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        console.log(isMatched);
        if (!isMatched) {
          req.flash("error", "current password is incorrect");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "password does not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "password updated successfully");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "all fields are required");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = Frontcontroller;
