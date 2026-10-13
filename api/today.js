	// api/today.js —— 历史上的今天
	const fs = require("fs");
	const path = require("path");
	// 这就是你的"钥匙"，将来收费就改这一行
	const MY_KEY = "test123";
	module.exports = async (req, res) => {
	  const { month, day, key } = req.query;
	  // 1. 验钥匙，不对就拒绝
	  if (key !== MY_KEY) {
	    return res.status(401).json({ code: 401, msg: "key无效" });
	  }
	  // 2. 验参数
	  if (!/^\d{1,2}$/.test(month || "") || !/^\d{1,2}$/.test(day || "")) {
	    return res.status(400).json({ code: 400, msg: "参数不对，示例：?month=10&day=12&key=test123" });
	  }
	  // 3. 去data文件夹找这个月的文件
	  try {
	    const file = path.join(process.cwd(), "data", `${parseInt(month, 10)}.json`);
	    const monthData = JSON.parse(fs.readFileSync(file, "utf8"));
	    const events = monthData[String(parseInt(day, 10))];
	    if (!events) throw new Error("没这天");
	    return res.status(200).json({ code: 200, data: events });
	  } catch (e) {
	    return res.status(404).json({ code: 404, msg: "该日期暂无数据" });
	  }
	};
