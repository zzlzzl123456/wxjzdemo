const uniCaptcha = require('uni-captcha')
module.exports = {
	async verify({scene,captcha}) {
		// scene 注意：在正式项目中，场景值（scene）应当在服务端设定，不由客户端自己传递。否则这是一个安全隐患
		let res = await uniCaptcha.verify({scene,captcha})
		if(res.code == 0){
			//...这里写你的业务逻辑
			return res
		}else{
			return res
		}
	}
}