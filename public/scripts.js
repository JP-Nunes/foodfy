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
   } else {
      element += `<a href="?page=${page}">${page}</a>`
   }
}

pagination.innerHTML = element

const currentUrl = location.href
const paginationItems = document.querySelectorAll('.pagination a')

for(item of paginationItems) {
   if(currentUrl.includes(item.getAttribute('href'))) {
      item.classList.add('active')
   }
}