exports.getdate = ()=>{

const format = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };

  const d = new Date();

  return d.toLocaleDateString('en-US', format);
};

exports.getday = ()=>{

    const format = {
        weekday: 'long'
      };
    
      const d = new Date();
    
      return d.toLocaleDateString('en-US', format);
    
    };