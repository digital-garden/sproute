get currentUser(): any {
	return this.authenticated ? this.authState.auth : null;
	}
	
get currentUserId(): string {
	return this.authenticated ? this.authState.uid : '';
	
private socialSignIn(provider: number): firebase.Promise<FirebaseAuthState>
	return this.af.auth.login({provider, method: AuthMethods.Popup})
		.then(() => updateUserData() )
		.catch(error => console.log(error));
		
private updateUserData(): void {
	let path = `users/${this.currentUserId}` ;
	let data = {
		name: this.currentUser.displayName,
		email: this.currentUser.email,
		}
		
		this.db.object(path).update(data)
		.catch(error => console.log(error));	
}


