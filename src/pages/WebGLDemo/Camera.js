class Camera{
	constructor(){
		this.eye = new Vector3([-1, 1, 1]);
		this.at = new Vector3([0, 1, 0]);
		this.up = new Vector3([0, 1, 0]);
		this.alpha = 5;
	}

	forward(){
		var f = new Vector3(this.at.elements).sub(this.eye);
		f.div(f.magnitude()*3);
		this.at.add(f);
		this.eye.add(f);
	}

	back(){
		var f = new Vector3(this.eye.elements).sub(this.at);
		f.div(f.magnitude()*3);
		this.at.add(f);
		this.eye.add(f);
	}

	left(){
		var f = new Vector3(this.eye.elements).sub(this.at);
		f.div(f.magnitude()*3);
		var s1 = new Vector3(this.up.elements);
		var s = Vector3.cross(f, s1);
		s.div(s.magnitude());
		this.at.add(s);
		this.eye.add(s);
	}

	right(){
		var f = new Vector3(this.eye.elements).sub(this.at);
		f.div(f.magnitude()*3);
		var s1 = new Vector3(this.up.elements);
		var s = Vector3.cross(s1, f);
		s.div(s.magnitude());
		this.at.add(s);
		this.eye.add(s);
	}

	panleft(alpha){
		if(!alpha){
			alpha = this.alpha;
		}
		let f = new Vector3(this.at.elements).sub(this.eye);
		let rotationMatrix = new Matrix4();
		rotationMatrix.setRotate(alpha,
      		this.up.elements[0],
      		this.up.elements[1],
      		this.up.elements[2]);
		let f_prime = rotationMatrix.multiplyVector3(f);
		this.at = f_prime.add(this.eye);
	}
	panright(alpha){
		if(!alpha){
			alpha = this.alpha;
		}
		let f = new Vector3(this.at.elements).sub(this.eye);
		let rotationMatrix = new Matrix4();
		rotationMatrix.setRotate(-1*alpha,
      		this.up.elements[0],
      		this.up.elements[1],
      		this.up.elements[2]);
		let f_prime = rotationMatrix.multiplyVector3(f);
		this.at = f_prime.add(this.eye);
	}

	panUp(alpha){
		if(!alpha){
			alpha = this.alpha;
		}
		let f = new Vector3(this.at.elements).add(new Vector3([0, 0.1 * alpha, 0]));
		this.at = f;
	}
	
	panDown(alpha){
		let f = new Vector3(this.at.elements).sub(new Vector3([0, 0.1 * alpha, 0]));
		this.at = f;
	}

}