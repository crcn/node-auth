module.exports = function(user, method) {

	//todo? if(user.level & level.SUPER) return {};
	
	return { permissions: { profile: user._id, access: access.code(method) } };
}
