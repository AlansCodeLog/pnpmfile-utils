const thisPkg = require("./package.json")
/** My own packages will always have the following as their version numbers. */
const symLinkedVersions = ["0.0.0", "0.0.0-semantically-released"]
/** For packages that aren't mine. */
const symLinkedNames = []

function removeLinkedPackages(deps, names, versions) {
	if (!deps) return
	for (const dep in deps) {
		if (names.includes(dep)) {
			console.log(`Removed symlinked package ${dep}`)
			delete deps[dep]
			return
		}
		let version = deps[dep]
		if (["~", "^"].includes(version[0])) version = version.slice(1)
		if (versions.includes(version)) {
			console.log(`Removed symlinked package ${dep}`)

			delete deps[dep]
		}
	}
}
/**
 * Pnpm does not handle locally (globally) linked packages semantic-release packages well. This will remove any packages whose version or names match, and only on the top level package.
 *
 * They will still remain in node_modules even though pnpm says it has removed them.
 * */
function removeGloballyLinked(pkg, thisPkg, names, versions) {
	if (pkg.name === thisPkg.name) {
		removeLinkedPackages(pkg.dependencies, names, versions)
		removeLinkedPackages(pkg.devDependencies, names, versions)
	}
}
/**
 * See https://github.com/johnsoncodehk/volar/discussions/592#discussioncomment-1763880
 */
function fixTypes(pkg, console) {
	if (pkg.dependencies["@types/react"]) {
		pkg.dependencies["@types/react"] = thisPkg.devDependencies["@types/react"]
	}
}

module.exports = {
  fixTypes,
  removeGloballyLinked
}
