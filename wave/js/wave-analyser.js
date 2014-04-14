var laolin=laolin||{};


laolin.waveAnalyser=(function() {
  var w={};
  w.absMax = function( ar ){
    mx=ar[0];
    for( var i=1; i<ar.length; i++) {
      if(Math.abs(ar[i])>mx)
        mx=Math.abs(ar[i]);
    }
    return mx;
  };

  //
  w.newmark=function(waveInput,amax,dt,Tn,zita,stepCount,stepStart) {
    if(tn<2*dt)
      return {error:'Need: Tn >= 2*dt.'};
    count=waveInput.length;//总步数
    wave=[];
    if(count<2)
      return {error:'wave data error.'};
    omax=w.absMax(wave);//原来的最大值
    if(omax<0.000001)
      return {error:'wave data is all zero.'};
    fac=Math.abs(amax/omax);
    waveInput.forEach(function(v){
      wave[i]=v*fac;
    });
    if('undefined'==typeof(stepCount)||stepCount<0)stepCount=count;
    if('undefined'==typeof(stepStart)||stepStart<0)stepStart=0;//从0步开始
    
    omega_n=2*3.14159265/Tn;  //公式 Eq.(2.1.5)
    
    gama=0.5;beta=0.25;  //平均加速度法
    //gama=0.5;beta=0.1666667;  //线性加速度法

    m=0.01;//随便，不影响结果！
    c=zita*2*m*omega_n;//阻尼系数c Eq.(2.2.2)
    k=m*omega_n*omega_n;//刚度公式 Eq.(2.1.4)
    U=[];
    V=[];// u的一阶导:v
    A=[];// u的二阶导:a
    A2=[];

    p0=0;
    U[0]=0;
    V[0]=0;
    //A[0]=0;
    A2[0]=0;

    //step 1.0 初始计算
    A[0]=(p0-c*V[0]-k*U[0])/m;
    
    K=k+(gama*c/beta/dt)+(m/beta/dt/dt);
    a=m/beta/dt+gama*c/beta;
    b=m/2/beta+dt*(gama/2/beta-1)*c;
    /*
    console.log('dt '+dt);
    console.log('Tn '+Tn);
    console.log('c '+c);
    console.log('count '+count);
    console.log('stepCount '+stepCount);
    console.log('stepStart '+stepStart);
    console.log('a '+a);
    console.log('b '+b);
    console.log('k '+k);
    console.log('K '+K);  //*/

    //console.log(wave);
    //step 2.0对每个时间步i进行计算
    for( i=0 ; /*i<count-1 && */i<stepCount-1; i++) { 
      //console.log(' ====  step : '+i);
      if(i+stepStart<count-1)
        dpi= -m*(wave[i+1+stepStart]-wave[i+stepStart]);  //Eq.(5.4.8)
      else
        dpi=0;//允许地震结束后再继续算后续的自由振动
      dPi=dpi+a*V[i]+b*A[i];  //step 2.1
      dui=dPi/K;  //step 2.2
      dVi=gama*dui/beta/dt-gama*V[i]/beta+dt*(1-gama/2/beta)*A[i];  //step 2.3
      dAi=dui/beta/dt/dt-V[i]/beta/dt-A[i]/2/beta;  //step 2.4
      
      /*
      console.log(',wv '+wave[i+stepStart]);
      console.log('dpi '+dpi);
      console.log('dPi '+dPi);
      console.log('dui '+dui);
      console.log('dVi '+dVi);
      console.log('dAi '+dAi); //*/
      U[i+1]=U[i]+dui;
      V[i+1]=V[i]+dVi;
      A[i+1]=A[i]+dAi;
      A2[i+1]=A[i+1]+wave[i+1+stepStart];
    }
    //console.log('wave');console.log(wave);
    //console.log('u');console.log(U);
    //console.log('v');console.log(V);
    //console.log('a');console.log(A);
    return {u:U,v:V,a:A,a2:A2};
  
 }//end newmark()
 
 return w;
})();
