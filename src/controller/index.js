const util = require("util");
const bcrypt = require("bcryptjs");
require("dotenv").config();
let connection = require("../db/database");
let ConnectionUtil = util.promisify(connection.query).bind(connection);
let { issueJWT } = require("../helper/jwt");
const jwt = require("jsonwebtoken");

//-------------------- register coordinator--------------------
module.exports.coordinator_Register = async (req, res) => {
  try {
    console.log("&&&&");
    var { name, number, gender, email, role, password } = req.body;
    console.log(name, number, gender, email, role, password, "OOOOO");
    if (!email) {
      return res.status(403).json({
        success: false,
        message: "email is required",
      });
    }
    //checking email from database
    var UserDetail = await ConnectionUtil(
      `select * from coordinators where email='${email}'`
    );
    if (UserDetail == "") {
      let hashpassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
      let userObj = {
        name: name,
        email: email,
        password: hashpassword,
        number: number,
        gender: gender,
        role: role,
      };
      var insertQuery = await ConnectionUtil(
        `INSERT INTO coordinators SET ?`,
        userObj
      );
      return res.status(200).json({
        success: true,
        message: "added",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "email already exist",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//-------------------- create respondent--------------------
module.exports.respondent_create = async (req, res) => {
  try {
    var { name, number, gender, email, role, password } = req.body;
    if (!email) {
      return res.status(403).json({
        success: false,
        message: "email is required",
      });
    }
    //checking email from database
    var UserDetail = await ConnectionUtil(
      `select * from respondents where email='${email}'`
    );
    if (UserDetail == "") {
      let hashpassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
      let userObj = {
        name: name,
        email: email,
        password: hashpassword,
        number: number,
        gender: gender,
        role: role,
      };
      var insertQuery = await ConnectionUtil(
        `INSERT INTO respondents SET ?`,
        userObj
      );
      if (insertQuery.insertId != 0) {
        var user = await ConnectionUtil(
          ` select * from respondents where email = ? `,
          email
        );

        const payload = {
          id: user[0].id,
          password: user[0].password,
          email: user[0].email,
          name: user[0].name,
          gender: user[0].gender,
          role: user[0].role,
          number: user[0].number
        };
        const token = await issueJWT(payload);

        user[0].tokens = token;
        return res.status(200).json({
          success: true,
          message: "added",
          data: user[0]
        });
      } else {
        res.status(404).json({
          success: false,
          message: "something went wrong",
        });
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "email already exist",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------------------login-----------------------------------
module.exports.coordinator_Login = async (req, res) => {
  try {
    var { email, password } = req.body;

    var user = await ConnectionUtil(
      ` select * from coordinators where email='${email}'`
    );
    if (user != "") {
      let compare = await bcrypt.compare(password, user[0].password);
      //password check condition
      if (compare == true) {
        const payload = {
          id: user[0].id,
          password: user[0].password,
          email: user[0].email,
          name: user[0].name,
          role: user[0].role,
          gender: user[0].gender,
          number: user[0].number,
        };
        const token = await issueJWT(payload);

        user[0].tokens = token;
        return res.status(200).json({
          success: true,
          status: "200",
          message: "user login successful",
          data: user[0],
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "invalid password",
          data: [],
        });
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "email id does not match with our records",
        data: [],
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      status: "400",
      message: err.message,
    });
  }
};

//update
module.exports.updateCoordinator = async (req, res) => {
  try {
    var { name, email, role, gender, number } = req.body;

    let { id } = req.user;

    var user = await ConnectionUtil(
      `select * from coordinators where id=?`,
      id
    );

    if (user != "") {
      var user2 = await ConnectionUtil(
        `UPDATE coordinators SET email='${email}',
        name='${name}',
        number='${number}',
        gender='${gender}',
        role='${role}' WHERE id='${id}'`
      );
      res.status(200).json({
        success: true,
        message: " respondent updated successfully...",
        userData: user2,
        user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "user does not exist ",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//--------------------------------- Show_Details ---------------------------------------------
module.exports.getDetails = async (req, res) => {
  try {
    let { id } = req.params;
    var user = await ConnectionUtil(
      `select * from coordinators where id=?`,
      id
    );
    res.status(200).json({
      success: true,
      message: "show single details of specific id",
      data: user,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//--------------------------------- Delete----------------------------------------
module.exports.delete = async (req, res) => {
  try {
    let { id } = req.params;
    let user_id = req.user;
    let CheckValidUser = await ConnectionUtil(
      `select * from coordinators where id='${id}'`
    );
    if (CheckValidUser != "") {
      let DeleteQuery = await ConnectionUtil(
        `delete from coordinators where id=${id}`
      );
      res.status(200).json({
        status: 200,
        error: 0,
        success: true,
        message: " Deleted Successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        success: true,
        message: "id is Not Valid",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

//-----------------------------show all the data of survey--------------------------
module.exports.getAllSurvey = async (req, res) => {
  try {
    let {id} = req.user;
    var user = await ConnectionUtil(
      `select * from respondents where id ='${id}' `
    );
    res.status(200).json({
      success: true,
      message: "entry which is added in page",
      data: user,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//--------------------------------- Delete survey----------------------------------------
module.exports.deleteSurvey = async (req, res) => {
  try {
    let { id } = req.params;
    let userid = req.user;
    let CheckValidUser = await ConnectionUtil(
      `select * from respondents where id='${id}'`
    );
    if (CheckValidUser != "") {
      let DeleteQuery = await ConnectionUtil(
        `delete from respondents where id=${id}`
      );
      res.status(200).json({
        status: 200,
        error: 0,
        success: true,
        message: " Deleted Successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        success: true,
        message: "id is Not Valid",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};
