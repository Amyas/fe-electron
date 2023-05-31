/**
 * @description 隐藏安全警告
 * @link https://www.electronjs.org/docs/latest/tutorial/security#isolation-for-untrusted-content
 */
export const hiddenSecurityWarnings = () => {
	process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
}
