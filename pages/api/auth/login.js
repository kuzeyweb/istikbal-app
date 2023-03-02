import session from "../../../lib/session";

export default session(async function (req, res) {
  req.session.set("user", { name: "John Doe" });
  await req.session.save();
  res.status(200).end();
});