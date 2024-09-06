const UserModel = require("../../models/v1/user.model")

const UserController = {
  async getAll(req, res) {
    try {
      const result = await UserModel.getAllUsers();

      if(result.status === 500){
        return res.status(500).json({
          message: result.message,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Users found",
        data: { total: result.count, users: result.results },
      })
    } catch (err) {
      console.log('error getAll :>> ', err.message);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        error: err.message,
      })
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params
      const result = await UserModel.getUserById(id)

      if(result.status === 400){
        return res.status(400).json({
          message: result.message,
        });
      }
      if(result.status === 404){
        return res.status(404).json({
          message: result.message,
        });
      }
      if(result.status === 500){
        return res.status(500).json({
          message: result.message,
        });
      }
      return res.status(200).json({
        status: "success",
        message: "User found",
        data: result,
      })
      } catch (err) {
        console.log('error getById :>> ', err.message);
        return res.status(500).json({
          status: "error",
          message: "Internal Server Error",
          error: err.message,
      })
    }
  },

  async create(req, res) {
    try {
      const result = await UserModel.userCreate(req.body);

      if(result.status === 400){
        return res.status(400).json({
          message: result.message,
        });
      }
      if(result.status === 500){
        return res.status(500).json({
          message: result.message,
        });
      }

      return res.status(201).json({
        status: "success",
        message: "User created",
        data: result,
      });
    } catch (err) {
      console.log('error create :>> ', err.message);
        return res.status(500).json({
          status: "error",
          message: "Internal Server Error",
          error: err.message,
      })
    }
  },

  async update(req, res) {
    const { id } = req.params;
    try {
      const result = await UserModel.userUpdate(id, req.user, req.body)

      if(result.status === 400){
        return res.status(400).json({
          message: result.message,
        });
      }
      if(result.status === 403){
        return res.status(403).json({
          message: result.message,
        });
      }
      if(result.status === 404){
        return res.status(404).json({
          message: result.message,
        });
      }
      if(result.status === 500){
        return res.status(500).json({
          message: result.message,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "User updated",
        data: result,
      });
    } catch (err) {
      console.log('error update :>> ', err.message);
        return res.status(500).json({
          status: "error",
          message: "Internal Server Error",
          error: err.message,
      })
    }
  },

  async login(req,res) {
    try {
      const result = await UserModel.userLogin(req.body)

      if (result.status === 400){
        return res.status(400).json({
          message: result.message,
        });
      }
      if (result.status === 403){
        return res.status(403).json({
          message: result.message,
        });
      }

      if (result.status === 404){
        return res.status(404).json({
          message: result.message,
        });
      }
      if (result.status === 500){
        return res.status(500).json({
          message: result.message,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Login success",
        data: result,
      });
    } catch (err) {
      console.log('error login :>> ', err.message);
        return res.status(500).json({
          status: "error",
          message: "Internal Server Error",
          error: err.message,
      })
    }
  },

  async verify(req, res) {
    const { id } = req.params;

    try {
      const result = await UserModel.userVerify(id);

      if (result.status === 404) {
        return res.status(404).json({ message: result.message });
      }
      if (result.status === 500) {
        return res.status(500).json({ message: result.message });
      }
      
      return res.status(200).json({
        status: "success",
        message: "Account verified",
      });
    } catch (err) {
      console.log('error verify :>> ', err.message);
        return res.status(500).json({
          status: "error",
          message: "Internal Server Error",
          error: err.message,
      })
    }
  },

  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const result = await UserModel.forgotPassword(email);

      if (result.status === 404) {
        return res.status(404).json({ message: result.message });
      }
  
      if (result.status === 500) {
        return res.status(500).json({ message: result.message });
      }

      return res.status(200).json({
        status: "success",
        message: "Reset link sent",
      });
    } catch (err) {
      console.log('error forgotPassword :>> ', err.message);
        return res.status(500).json({
          status: "error",
          message: "Internal Server Error",
          error: err.message,
      })
    }
  },

  async resetPassword(req, res) {
    const { id } = req.params;
    const { password } = req.body;

    try {
      const result = await UserModel.resetPassword(id, password);

      if (result.status === 500) {
        return res.status(500).json({ message: result.message });
      }

      return res.status(200).json({ message: "Password reset successful" });

    } catch (err) {
      console.log('error resetPassword :>> ', err.message);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        error: err.message,
      })
    }
  }
}

module.exports = UserController;