#Importing neccesary packages:
import streamlit as st
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from importlib import reload
import seaborn as sns
import time
import pickle

from sklearn.feature_selection import SelectKBest, chi2
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB 
from sklearn.neighbors import KNeighborsClassifier 
from sklearn.tree import DecisionTreeClassifier 
from sklearn.svm import LinearSVC
from xgboost import XGBClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import precision_recall_curve, precision_score, recall_score, f1_score, accuracy_score
from sklearn.metrics import roc_curve, auc, roc_auc_score, plot_confusion_matrix, classification_report

train=pd.read_csv('UNSW_NB15_training-set.csv')
test = pd.read_csv("UNSW_NB15_testing-set.csv")
df1=pd.concat([train,test])

attack=df1[df1['label']==1]
not_attack=df1[df1['label']==0]

df = df1
list_drop = ['id','attack_cat']
df.drop(list_drop,axis=1,inplace=True)

df_numeric = df.select_dtypes(include=[np.number])

DEBUG =0

for feature in df_numeric.columns:
    if DEBUG == 1:
        print(feature)
        print('max = '+str(df_numeric[feature].max()))
        print('75th = '+str(df_numeric[feature].quantile(0.95)))
        print('median = '+str(df_numeric[feature].median()))
        print(df_numeric[feature].max()>10*df_numeric[feature].median())
        print('----------------------------------------------------')
    if df_numeric[feature].max()>10*df_numeric[feature].median() and df_numeric[feature].max()>10 :
        df[feature] = np.where(df[feature]<df[feature].quantile(0.95), df[feature], df[feature].quantile(0.95))

df_numeric = df.select_dtypes(include=[np.number])
df_before = df_numeric.copy()
DEBUG = 0
for feature in df_numeric.columns:
    if DEBUG == 1:
        print(feature)
        print('nunique = '+str(df_numeric[feature].nunique()))
        print(df_numeric[feature].nunique()>50)
        print('----------------------------------------------------')
    if df_numeric[feature].nunique()>50:
        if df_numeric[feature].min()==0:
            df[feature] = np.log(df[feature]+1)
        else:
            df[feature] = np.log(df[feature])

df_numeric = df.select_dtypes(include=[np.number])

df_cat = df.select_dtypes(exclude=[np.number])

DEBUG = 0
for feature in df_cat.columns:
    if DEBUG == 1:
        print(feature)
        print('nunique = '+str(df_cat[feature].nunique()))
        print(df_cat[feature].nunique()>6)
        print(sum(df[feature].isin(df[feature].value_counts().head().index)))
        print('----------------------------------------------------')
    
    if df_cat[feature].nunique()>6:
        df[feature] = np.where(df[feature].isin(df[feature].value_counts().head().index), df[feature], '-')

df_cat = df.select_dtypes(exclude=[np.number])

best_features = SelectKBest(score_func=chi2,k='all')

X = df.iloc[:,4:-2]
y = df.iloc[:,-1]
fit = best_features.fit(X,y)

df_scores=pd.DataFrame(fit.scores_)
df_col=pd.DataFrame(X.columns)

feature_score=pd.concat([df_col,df_scores],axis=1)
feature_score.columns=['feature','score']
feature_score.sort_values(by=['score'],ascending=True,inplace=True)

X = df.iloc[:,:-1]
y = df.iloc[:,-1]
feature_names = list(X.columns)

ct = ColumnTransformer(transformers=[('encoder', OneHotEncoder(), [1,2,3])], remainder='passthrough')
X = np.array(ct.fit_transform(X))

for label in list(df_cat['state'].value_counts().index)[::-1][1:]:
    feature_names.insert(0,label)
    
for label in list(df_cat['service'].value_counts().index)[::-1][1:]:
    feature_names.insert(0,label)
    
for label in list(df_cat['proto'].value_counts().index)[::-1][1:]:
    feature_names.insert(0,label)

sc = StandardScaler()
X[:, 18:] = sc.fit_transform(X[:, 18:])




class GradientBoost:
    def __init__(self):
        self.xgb_attack = XGBClassifier()
        self.xgb_category = XGBClassifier()
        self.xgb_subcategory = XGBClassifier()
    
    def fit(self,X_train,y_train):
        self.xgb_attack.fit(X_train,y_train['attack'])
        
        features_category = np.concatenate((X_train,np.array(y_train['attack']).reshape(-1,1)),axis=1)
        self.xgb_category.fit(features_category,y_train['category'])
        
        features_subcategory = np.concatenate((features_category,np.array(y_train['category']).reshape(-1,1)),axis=1)
        self.xgb_subcategory.fit(features_subcategory,y_train['subcategory'])
        
    def predict(self,X_test):
        predict_attack = self.xgb_attack.predict(X_test)
        
        test_category = np.concatenate((X_test,predict_attack.reshape(-1,1)),axis=1)
        predict_category = self.xgb_category.predict(test_category)
        
        test_subcategory = np.concatenate((test_category,predict_category.reshape(-1,1)),axis=1)
        predict_subcategory = self.xgb_subcategory.predict(test_subcategory)
        
        return pd.DataFrame({'attack':predict_attack,'category':predict_category,'subcategory':predict_subcategory})

header=st.container()
dataset=st.container()
features=st.container()
modelTraining=st.container()

with st.sidebar:
    add_radio = st.radio(
        "Choose a method",
        ("Home","Train our model","Perform an Attack", "No attack performed")
    )

with header:
	st.title('Welcome to our project')

if add_radio=='Home':
	st.subheader('About the project:')
	st.write("With IoT systems taking up a vital place in most of the sectors of IT Technology, it has become a conspicuous target for people with malicious intent. Taking into consideration such vulnerabilities and challenges in use of such systems, a need arises for development of effective protective measures such as intrusion detection systems, network forensic systems, etc. An efficient way to deal with such challenges is to use security systems based on Machine Learning. The project aims to analyse different types of attacks using the Bot-IoT dataset and also apply & compare different classification algorithms. In the project, machine learning algorithms are applied and tested using ten best features from the dataset. Based on the paper 'Towards the development of realistic botnet dataset in the Internet of Things for network forensic analytics: Bot-IoT dataset' containing dataset description, the ten best features were extracted from the main data.")

if add_radio=='Train our model':
	data = pd.read_csv("UNSW_2018_IoT_Botnet_Final_10_best_Training.csv")

	ten_best_features = data[['seq','stddev','N_IN_Conn_P_SrcIP', 'min', 'state_number', 'mean', 'N_IN_Conn_P_DstIP', 'drate', 'srate', 'max']]
	target_features = data[['attack','category','subcategory']]

	le = LabelEncoder()
	target_features['category'] = le.fit_transform(target_features['category'])
	target_features['subcategory'] = le.fit_transform(target_features['subcategory'])

	# Train-test Split
	X_train, X_test, y_train, y_test = train_test_split(ten_best_features,target_features)

	# Scaling the data
	sc = StandardScaler()
	X_train = sc.fit_transform(X_train)
	X_test = sc.transform(X_test)

	xgb = GradientBoost()
	xgb.fit(X_train,y_train)
	

if add_radio=='Perform an Attack':
	if st.button('Perform the attack'):
		new=attack.sample()
		st.write(new)
		# load the model from disk
		filename='finalized_model1.sav'
		loaded_model = pickle.load(open(filename, 'rb'))
		
		
		temp=X
		
		predictions_xgb = loaded_model.predict(temp)
		st.write(predictions_xgb[0])
		
		if predictions_xgb[0]==1:
			st.warning('This is a warning. You may be under an attack.')

if add_radio=='No attack performed':
	if st.button('Increase traffic & is not an attack'):
		new=not_attack.sample()
		st.write(new)
		# load the model from disk
		filename='finalized_model1.sav'
		loaded_model = pickle.load(open(filename, 'rb'))
		

		temp=X
		
		predictions_xgb = loaded_model.predict(temp)
		st.write(predictions_xgb[1])
		if predictions_xgb[1]==1:
			st.warning('This is a warning. You may be under an attack.')
