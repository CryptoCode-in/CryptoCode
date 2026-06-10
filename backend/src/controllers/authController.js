const supabase = require("../config/supabase");

const signup = async(req, res) => {
    const { name, email,password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields required" });
    }
    
    const { data: authData, error: authError } =
  await supabase.auth.signUp({
    email,
    password,
  });

console.log("Signup Request:", email);
console.log("Auth Error:", authError);

  if (authError) {
  return res.status(400).json({
    success: false,
    message: authError.message,
  });
}

//console.log("AUTH USER:", authData.user);

console.log("AUTH DATA:", authData);
console.log("AUTH ERROR:", authError);

const userId = authData.user.id;

    const { data, error } = await supabase
        .from("profiles")
        .insert([{ user_id : userId , name, email, role }])
        .select();

        console.log("PROFILE ERROR:", error);
        console.log("PROFILE DATA:", data);

    if (error) return res.status(500).json({ error });

    res.status(201).json({ success: true, user: data });
};




const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and Password required"
        });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    res.status(200).json({
        success: true,
        user: data.user,
        session: data.session
    });
};

module.exports = { signup,login };