"use strict"

/**
 * Maps a repository DTO to a Entity model Repository, which only has what is needed
 * @param repos
 * @return {Array} of literals  //TODO: Instanceof REPOS
 */
module.exports = function(repos){
    const myRepos = []
    repos.forEach((repo) => {
        let myRepo = {
            name: repo.name,
            owner: repo.owner.login,
            issues_url: '/github/'+repo.name+'/issues?owner='+repo.owner.login,
        }
        myRepos.push(myRepo)
    })
    return myRepos
}