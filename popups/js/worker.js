self.onmessage = async function({data}){
  
  
  let allNotes = Object.keys(data);


    let fileContent = '';
    allNotes.forEach((item,index) => {

  
      let {url} = data[item]
      fileContent += `${index+1}. ${item}\n`;
      fileContent += `(${url})\n\n`;
      data[item]['content'] && data[item]['content'].forEach(({content}) => {
    
        fileContent += `- ${content}\n\n`
    
      });
    
      fileContent += "\n\n"
    
    
     })

     
    
    postMessage({content:fileContent});
}
    
