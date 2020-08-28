function set(key, data, sync = true) {
	try {
		if (sync) {
			return uni.setStorageSync(key, data);
		} else {
			uni.setStorage({
				key,
				data,
				success: function(res) {

				}
			});
		}
	} catch (e) {
		return false;
	}
}

function get(key, sync = true) {
	try {
		if (sync) {
			return uni.getStorageSync(key);
		} else {
			let val = '';
			uni.getStorage({
				key,
				success: function(res) {
					val = res.data;
				}
			});
			return val;
		}
	} catch (e) {
		return false;
	}
}

function info(sync = false) {
	try {
		if (sync) {
			return uni.getStorageInfoSync();
		} else {
			let val = '';
			uni.getStorageInfo({
				success: function(res) {
					val = res;
				}
			});
			return val
		}
	} catch (e) {
		return false;
	}
}

function remove(key, sync = true) {
	try {
		if (sync) {
			return uni.removeStorageSync(key);
		} else {
			uni.removeStorage({
				key: key
			});
		}
	} catch (e) {
		return false;
	}
}

function clear(sync = true) {
	try {
		if (sync) {
			return uni.clearStorageSync();
		} else {
			uni.clearStorage();
		}
	} catch (e) {
		return false;
	}
}

function has(key, sync = true) {
	try {
		if (sync) {
			return uni.getStorageSync(key) !== null;
		} else {
			let val = false;
			uni.getStorage({
				key: key,
				success: function(res) {
					val = res.data !== null;
				}
			});
			return val;
		}
	} catch (e) {
		return false;
	}
}

const storage = {
	get,
	set,
	info,
	remove,
	clear,
	has
}
export default storage;
