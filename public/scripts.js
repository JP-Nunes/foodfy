const PhotosUpload = {
   input: '',
   preview: document.querySelector('#images-preview'),
   limit: 5,
   files: [],
   handleFilesInput(event) {
      const { files: filesList } = event.target
      PhotosUpload.input = event.target

      if(PhotosUpload.reachedLimit(event)) return

      Array.from(filesList).forEach(file => {
         PhotosUpload.files.push(file)

         const reader = new FileReader()

         reader.onload = () => {
            const image = new Image()
            image.src = String(reader.result)
            
            const div = PhotosUpload.createDiv(image)
            PhotosUpload.preview.appendChild(div)
         }
         
         reader.readAsDataURL(file)
      })

      PhotosUpload.input.files = PhotosUpload.getAllFiles()
   },
   getAllFiles() {
      const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

      PhotosUpload.files.forEach(file => dataTransfer.items.add(file))
   
      return dataTransfer.files
   },
   reachedLimit(event) {
      const { limit, input, preview } = PhotosUpload
      const { files: filesList} = input

      if(filesList.length > limit) {
         alert(`Máximo de ${limit} imagens`)
         event.preventDefault()
         
         return true
      }

      const imagesDiv = []
      preview.childNodes.forEach(item => {
         if(item.classList && item.classList.value == "preview") {
            imagesDiv.push(item)
         }
      })

      const totalPhotos = imagesDiv.length + filesList.length

      if(totalPhotos > limit) {
         alert('Limite máximo de imagens excedido.')
         event.preventDefault

         return true
      }

      return false
   },
   createDiv(image) {
      const div = document.createElement('div')
        
      div.classList.add('preview')
      div.onclick = PhotosUpload.removeImage
      div.appendChild(image)
      div.appendChild(PhotosUpload.createRemoveButton())

      return div
   },
   createRemoveButton() {
      const button = document.createElement('i')
      button.classList.add('material-icons')
      button.innerHTML = 'add'

      return button
   },
   removeImage(event) {
      const imageDiv = event.target.parentNode
      const imagesArray = Array.from(PhotosUpload.preview.children)
      const imageIndex = imagesArray.indexOf(imageDiv)

      PhotosUpload.files.splice(imageIndex, 1)
      PhotosUpload.input.files = PhotosUpload.getAllFiles()

      imageDiv.remove()
   },
   removeOldImage(event) {
      console.log('Estou aqui')
      const imageDiv = event.target.parentNode

      if(imageDiv.id) {
         const removedFiles = document.querySelector('input[name="removed_files"')

         if(removedFiles) {
            removedFiles.value += `${imageDiv.id},`
         }
      }

      imageDiv.remove()
   }
}

const ChefImageUpload = {
   handleInput(event) {
      const { files } = event.target
      const file = files[0]
      const preview = document.getElementById('chef_image-input')      
      
      preview.value = file.name
   }
}

const ImageGallery = {
   mainImage: document.querySelector('#main-image img'),
   previews: document.querySelectorAll('#side-images img'),
   setImage(event) {
      const { target } = event

      this.previews.forEach(preview => preview.classList.remove('active'))
      target.classList.add('active')

      this.mainImage.src = target.src
   }
}

const Validate = {
   apply(input, func) {
      Validate.clearErrorMessage(input)

      let results = Validate[func](input.value)
      input.value = results.value

      if(results.error) {
         Validate.displayError(input, results.error)
      }
   },
   displayError(input, error) {
      const div = document.createElement('div')
      div.classList.add('error')
      div.innerHTML = error
      input.parentNode.appendChild(div)
      input.focus()    
   },
   clearErrorMessage(input) {
      const errorDiv = input.parentNode.querySelector('.error')

      if(errorDiv) {
         errorDiv.remove()
      }
   },
   isEmail(value) {
      let error = null
      const emailFormat = /^\w+([\._-]\w+)*@\w+([\._-]\w+)*(\.\w{2,3})+/

      if(!value.match(emailFormat)) {
         error="Email inválido"
      }

      return {
         error,
         value
      }
   },
}






// Header menu

const currentPage = location.href
const menuItems = document.querySelectorAll('header .menu ul li a')

for(item of menuItems) {
   if(currentPage.includes(item.getAttribute('href'))) {
      item.classList.add('active')
   }
}

// Paginação

function paginate(totalPages, selectedPage) {
   
   let pages = []
   let oldPage

   for(let currentPage = 1; currentPage <= totalPages; currentPage++) {

      const firstAndLastPages = currentPage == 1 || currentPage == totalPages
      const pagesAfterCurrentPage = currentPage <= selectedPage + 2
      const pagesBeforeCurrentPage = currentPage >= selectedPage - 2
      
      if(firstAndLastPages || pagesAfterCurrentPage && pagesBeforeCurrentPage) {
         
         if(oldPage && currentPage - oldPage > 2) {
            pages.push('...')
         }
         if(oldPage && currentPage - oldPage == 2) {
            pages.push(oldPage + 1)
         }
         
         pages.push(currentPage)

         oldPage = currentPage
      }
   }
   return pages 
}

const pagination = document.querySelector('.pagination')
const page = +pagination.dataset.page
const total = +pagination.dataset.total

const pages = paginate(total ,page)

let element = ''

for(let page of pages) {
   if(String(page).includes('...')) {
      element += `<span>${page}</span>`
   } else if(page == 1) {
      element += `<a href="?page=${page}" class="active" id="first-item">${page}</a>`
   } 
   else {
      element += `<a href="?page=${page}">${page}</a>`
   }
}

pagination.innerHTML = element

const currentUrl = location.href
const paginationItems = document.querySelectorAll('.pagination a')
const firstItem = document.getElementById('first-item')

for(item of paginationItems) {
   if(currentUrl.includes(item.getAttribute('href')) && 
      item.getAttribute('href') !== firstItem.getAttribute('href')) {
      
      item.classList.add('active')
      firstItem.classList.remove('active')
   }
}