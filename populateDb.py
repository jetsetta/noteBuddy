categories = {
  "Command Line" : ["Prompts", "Git Commands", "NPM", "Sequelize"],

  "Pyhton": ["Data Types","Functions","Conditions","Arrays","Loops","Dictionaries ","Objects","Classes","Math Operations","Unit Tests","Reading & Writing Files"],

  "Tools": ["Chrome Developer Tools", "Postman", "Firebase", "Nodemon", "SQL Fiddle", "Font Sites", "Color Picking Sites"],

  "Front-End": ["HTML","CSS","Media Queries","Sass"],

  "Javascript" : ["Functions", "Events", "Loops", "Conditions", "Types", "DOM Manipulation", "Forms ", "Validation", "Objects", "Template Literals", "ES6", "Callbacks", "JSON", "HTTP GET & POST", "Map, Filter, Reduce", "Web APIs"],

  "Frameworks" : ["Bootstrap", "Node.js", "Express.js", "Socket.io", "PG Promise"],

  "Libraries" : ["jQuery", "Ajax", "Mustache", "Handlebars"],

  "Database" : ["PostGres", "SQL", "Sequelize"],

  "Hosting" : ["Heroku", "Surge"],
}

from selenium import webdriver 
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
import time

driver = webdriver.Chrome()

addCategories = "http://localhost:5000/categories/add"
addTopic = "http://localhost:5000/topics/add"
global cat
for category in categories.keys():
  cat = category
  driver.get(addCategories)
  title = driver.find_element_by_id("title")
  add_cat_btn = driver.find_element_by_id("add_category")
  title.send_keys(category)
  add_cat_btn.click()
  for topic in categories[category]:
    driver.get(addTopic)
    driver.find_element_by_class_name("select-dropdown").click()
    span_elements = driver.find_elements_by_tag_name("span")
    time.sleep(1)
    for element in span_elements:
      if cat == element.text:
        element.click()
        time.sleep(1)
    title = driver.find_element_by_id("title")
    title.send_keys(topic)
    but_sub = driver.find_element_by_id("add_topic")
    but_sub.click()