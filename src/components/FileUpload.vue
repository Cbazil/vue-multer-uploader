<template>
  <div class="file">
    <form @submit.prevent="onSubmit" enctype="multipart/form-data">
      <div class="fields"> 
        <label>Upload File</label><br />
        <input type="file" ref="file" @change="onSelect"/>
      </div>
      <div class="field">
        <button>Submit</button>
      </div>
      <div>
        <h5>{{ message }}</h5>
      </div>
    </form>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'FileUpload',
  data() {
    return {
      file: "",
      message: ""
    }
  },
  methods: {
    onSelect(){
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      const file = this.$refs.file.files[0];
      this.file = file;
      if(!allowedTypes.includes(file.type)){
        this.message = "FileType is wrong"
      }
      if(file.size > 500000) {
        this.message = 'Too large, max size allowed is 500KB'
      }
    },
    async onSubmit() {
      const formData = new FormData();
      formData.append('file', this.file);
      try {
        await axios.post('http://localhost:5000/upload', formData);
        this.message = 'Uploaded!!'
      } catch (err) {
        console.log(err);
        this.message = err.message.data.error
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
