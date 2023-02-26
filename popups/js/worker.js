self.onmessage = async function({data}){
  
  
  let allNotes = Object.keys(data);

    let content = data;
    let fileContent = '';
    allNotes.forEach((item,index) => {

  
     
      fileContent += `${item}\n\n`;
      content[item]['content'] && content[item]['content']
      .forEach(({content}) => {
    
        fileContent += `${content}\n\n`
    
      });
    
      fileContent += "\n\n"
    
    
     })

     
    
    postMessage({content:fileContent});
}
    
