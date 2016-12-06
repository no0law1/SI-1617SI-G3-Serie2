"use strict"

module.exports = {

    /**
     * Maps a repository DTO to a Entity model Repository, which only has what is needed
     * @param repos
     * @return {Array} of literals  //TODO: Instanceof REPOS
     */
    repos: function (repos) {
        const myRepos = []
        repos.forEach((repo) => {
            let myRepo = {
                name: repo.name,
                owner: repo.owner.login,
                issues_url: '/github/' + repo.name + '/issues?owner=' + repo.owner.login,
            }
            myRepos.push(myRepo)
        })
        return myRepos
    },

    /**
     * Maps an issue DTO to a Entity model Issue, which only has what is needed
     * @param issues
     * @return {Array}
     */
    issues: function(issues){
        const myIssues = []
        issues.forEach((issue) => {
            let myIssue = {
                name: issue.title,
                owner: issue.user.login,
                body: issue.body,
                closed: (issue.closed_at != null),
            }
            myIssues.push(myIssue)
        })
        return myIssues
    }
}