const zIndexes = {
	toolbars: 2,
	header: 3,
	threadActions: 3,
	threadsSidebar: 4,
	tweetModal: 5,
	autoPlugModal: 6,
	shareDraftModal: 6,
	accountsModal: 7,
	editSchedule: 7,
	settingsModal: 8,
	affiliateModal: 8,
	manageTeamModal: 8,
	imageEditor: 12,
	imageEditorShare: 13,
	addAccountModal: 14,
	paywallModal: 16,
	// Tooltips have zIndex 18 in tippy.css
	imagePreview: 20,
	logInModal: 15,
};

Object.keys(zIndexes).forEach(
	(key) => (zIndexes[key] = zIndexes[key].toString())
);

export default zIndexes;
