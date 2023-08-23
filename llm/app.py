from langchain.document_loaders.markdown import UnstructuredMarkdownLoader
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from dotenv import load_dotenv
from langchain.text_splitter import TextSplitter
import streamlit as st

load_dotenv()

documents = UnstructuredMarkdownLoader(file_path="mojo-team-answers.md", mode="elements").load()

embeddings = OpenAIEmbeddings()
db = FAISS.from_documents(documents, embeddings)

def retrieve_info(query):
    similar_response = db.similarity_search(query, k=3)

    page_contents_array = [doc.page_content for doc in similar_response]

    return page_contents_array

llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-16k-0613")

template = """
You answer questions about a new programming language named "Mojo" developed by the company "Modular"

Below is the question you've received from someone trying to learn about the language. Please answer the question:
{message}

Here is a list of answers the team have given previously:
{answers}
"""

prompt = PromptTemplate(
    input_variables=["message", "answers"],
    template=template,
)

chain = LLMChain(llm=llm, prompt=prompt)

def generate_response(message):
    answers = retrieve_info(message)
    response = chain.run(message=message, answers=answers)
    return response

def main():
    st.set_page_config(
        page_title="Mojo Chatbot",
        page_icon=":fire:",
    )

    message = st.text_area("Ask Question:")

    if message:
        st.write("Generating answer...")
        result = generate_response(message)
        st.info(result)

if __name__ == "__main__":
    main()
