const PhotosUpload = {
   preview: document.querySelector('#images-preview'),
   limit: 5,
   handleFilesInput(event) {
      const { files: filesList } = event.target

      if(PhotosUpload.reachedLimit(event)) return

      Array.from(filesList).forEach(file => {
         const reader = new FileReader()

         reader.readAsDataURL(file)

         reader.onload = () => {
            const image = new Image()
            image.src = String(reader.result)

            const container = PhotosUpload.createContainer(image)

            PhotosUpload.preview.appendChild(container)
         }
      })
   },
   reachedLimit(event) {
      const { files: filesList } = event.target
      const { limit } = PhotosUpload

      if(filesList.length > limit) {
         alert(`Máximo de ${limit} imagens`)
         event.preventDefault()
         
         return true
      }

      return false
   },
   createContainer(image) {
      const container = document.createElement('div')
      container.classList.add('image')

      container.onClick = () => alert('clicked') 
      
      container.appendChild(image)
      container.appendChild(PhotosUpload.createRemoveButton())

      return container
   },
   createRemoveButton() {
      const button = document.createElement('i')
      button.classList.add('material-icons')
      button.innerHTML = 'add'

      return button
   }
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