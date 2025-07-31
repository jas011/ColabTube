export function localStore(Item,value){
    localStorage.setItem(Item,value);
  }
 
 export function cookies(cookie,days){
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    document.cookie = `${cookie};expires=${d.toUTCString()}`
  }


