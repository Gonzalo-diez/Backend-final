import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const userController = {
    /* Metodo para el proyecto en algun futuro
    getUserById: async (req, res) => {
        const userId = req.params.uid;

        try {
            const userDetail = await User.findOne({ _id: userId }).lean();

            if (req.accepts('html')) {
                return res.render('user', { user: userDetail });
            }

            res.json(userDetail);
        }
        catch (err) {
            console.error("Error al ver los detalles:", err);
            return res.status(500).json({ error: "Error en la base de datos", details: err.message });
        }
    },
    */

    getLogin: async (req, res) => {
        res.render("login");
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ error: "Credenciales invalidas" });
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ error: "Credenciales invalidas" });
            }

            if (email === "adminCoder@coder.com" && password === "adminCod3er123") {
                user.role = "admin";
            }

            res.cookie("user_id", user._id, { maxAge: 100000, httpOnly: true });

            req.session.userId = user._id;

            req.session.user = user;

            req.session.isAuthenticated = true;

            return res.redirect("/api/products");

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getRegister: async (req, res) => {
        res.render("register");
    },

    register: async (req, res, next) => {
        const { first_name, last_name, email, age, password } = req.body;

        try {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ error: "El usuario ya existe" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const role = email === "adminCoder@coder.com" ? "admin" : "user";

            const newUser = new User({
                first_name: first_name,
                last_name: last_name,
                email: email,
                age: age,
                password: hashedPassword,
                role,
            });

            await newUser.save();

            res.cookie("user_id", newUser._id, { maxAge: 100000, httpOnly: true });

            req.session.userId = newUser._id;

            req.session.user = newUser;

            req.session.isAuthenticated = true;

            return res.redirect("/api/products");

        } catch (error) {
            console.error("Error al registrar usuario:", error);
            next(error);
        }
    },


    logOut: async (req, res) => {
        try {
            res.clearCookie("user_id");
            req.session.userId = null;
            return res.redirect("/api/users/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

export default userController;